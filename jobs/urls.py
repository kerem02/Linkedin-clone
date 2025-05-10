from django.urls import path
from .views import JobPostCreateView, JobListView, ApplyToJobView, RecruiterApplicationsView, AdminJobManagementView
from .views import FlagJobView


urlpatterns = [
    path('jobs/', JobPostCreateView.as_view()),
    path('job-list/', JobListView.as_view()),
    path('apply/', ApplyToJobView.as_view()),
    path('applications/', RecruiterApplicationsView.as_view()),
    path('admin/jobs/', AdminJobManagementView.as_view()),  # GET
    path('admin/jobs/<int:job_id>/', AdminJobManagementView.as_view()),  # DELETE
    path("jobs/<int:job_id>/flag/", FlagJobView.as_view()),

]
