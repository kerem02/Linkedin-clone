from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.models import Profile
from rest_framework.permissions import AllowAny
from .models import JobPost
from .models import Application


class JobPostCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        profile = Profile.objects.get(user=user)

        if profile.role != 'recruiter':
            return Response({"error": "Only recruiters can post jobs."}, status=403)

        data = request.data
        job = JobPost.objects.create(
            title=data.get("title"),
            description=data.get("description"),
            company=data.get("company"),
            location=data.get("location"),
            posted_by=user
        )

        return Response({
            "message": "Job post created",
            "job_id": job.id
        }, status=status.HTTP_201_CREATED)

class JobListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        jobs = JobPost.objects.all().order_by('-created_at')
        data = [
            {
                "id": job.id,
                "title": job.title,
                "description": job.description,
                "company": job.company,
                "location": job.location,
                "posted_by": job.posted_by.username,
                "created_at": job.created_at
            }
            for job in jobs
        ]
        return Response(data)


class ApplyToJobView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        profile = Profile.objects.get(user=user)

        if profile.role != "user":
            return Response({"error": "Only job seekers can apply."}, status=403)

        job_id = request.data.get("job_id")
        if not job_id:
            return Response({"error": "Job ID is required."}, status=400)

        try:
            job = JobPost.objects.get(id=job_id)
        except JobPost.DoesNotExist:
            return Response({"error": "Job not found."}, status=404)

        if Application.objects.filter(applicant=user, job=job).exists():
            return Response({"message": "Already applied."}, status=200)

        Application.objects.create(applicant=user, job=job)
        return Response({"message": "Application submitted."}, status=201)


class RecruiterApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = Profile.objects.get(user=user)

        if profile.role != "recruiter":
            return Response({"error": "Only recruiters can view applications."}, status=403)

        jobs = JobPost.objects.filter(posted_by=user)
        applications = Application.objects.filter(job__in=jobs).select_related('job', 'applicant')

        data = [
            {
                "applicant": app.applicant.username,
                "job_title": app.job.title,
                "applied_at": app.applied_at
            }
            for app in applications
        ]
        return Response(data)


class AdminJobManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        if profile.role != "admin":
            return Response({"error": "Forbidden"}, status=403)

        jobs = JobPost.objects.filter(is_flagged=True).order_by("-created_at")

        data = [
            {
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "posted_by": job.posted_by.username,
                "created_at": job.created_at
            }
            for job in jobs
        ]
        return Response(data)

    def delete(self, request, job_id):
        profile = Profile.objects.get(user=request.user)
        if profile.role != "admin":
            return Response({"error": "Forbidden"}, status=403)

        try:
            job = JobPost.objects.get(id=job_id)
            job.delete()
            return Response({"message": "Job deleted."})
        except JobPost.DoesNotExist:
            return Response({"error": "Job not found."}, status=404)


from .models import JobPost

class FlagJobView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, job_id):
        try:
            job = JobPost.objects.get(id=job_id)

        except JobPost.DoesNotExist:
            return Response({"error": "Job not found"}, status=404)

        job.is_flagged = True
        job.save()
        return Response({"message": "Job has been flagged."}, status=200)