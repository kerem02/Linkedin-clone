from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile
from rest_framework.permissions import IsAuthenticated
from .models import Connection
from django.db.models import Q
from .models import Message

class RegisterView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        role = request.data.get('role', 'user')  # default: user

        if role not in ['user', 'recruiter']:
            return Response({"error": "Invalid role"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "User already exists"}, status=400)

        user = User.objects.create_user(username=username, password=password)
        profile = Profile.objects.get(user=user)
        profile.role = role
        profile.save()

        return Response({"message": "User created"}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            })
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = Profile.objects.get(user=user)
        return Response({
            "username": user.username,
            "role": profile.role,
            "bio": profile.bio,
            "experience": profile.experience,
            "education": profile.education
        })



class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        profile = Profile.objects.get(user=user)

        profile.bio = request.data.get("bio", profile.bio)
        profile.experience = request.data.get("experience", profile.experience)
        profile.education = request.data.get("education", profile.education)

        profile.save()

        return Response({"message": "Profile updated successfully."})


class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.exclude(id=request.user.id).filter(profile__role="user")

        data = [
            {
                "id": u.id,
                "username": u.username,
                "bio": getattr(u.profile, "bio", ""),
                "role": getattr(u.profile, "role", "")
            }
            for u in users
        ]
        return Response(data)


class ConnectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        sender = request.user
        receiver_id = request.data.get("receiver_id")

        if not receiver_id:
            return Response({"error": "receiver_id required"}, status=400)

        if int(receiver_id) == sender.id:
            return Response({"error": "Cannot connect to yourself."}, status=400)

        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        existing = Connection.objects.filter(
            Q(sender=sender, receiver=receiver) |
            Q(sender=receiver, receiver=sender)
        ).exclude(status="rejected")
        if existing.exists():
            return Response({"message": "Connection already sent or exists."}, status=200)

        Connection.objects.create(sender=sender, receiver=receiver, status="pending")
        return Response({"message": "Connection request sent."}, status=201)


class IncomingRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        connections = Connection.objects.filter(receiver=user, status="pending").select_related("sender")
        data = [
            {
                "id": conn.id,
                "sender_id": conn.sender.id,
                "sender_username": conn.sender.username,
                "created_at": conn.created_at
            }
            for conn in connections
        ]
        return Response(data)

    def post(self, request):
        user = request.user
        conn_id = request.data.get("connection_id")
        action = request.data.get("action")  # "accept" or "reject"

        try:
            conn = Connection.objects.get(id=conn_id, receiver=user, status="pending")
        except Connection.DoesNotExist:
            return Response({"error": "Request not found."}, status=404)

        if action == "accept":
            conn.status = "accepted"
            conn.save()
            return Response({"message": "Connection accepted."})
        elif action == "reject":
            conn.status = "rejected"
            conn.save()
            return Response({"message": "Connection rejected."})
        else:
            return Response({"error": "Invalid action."}, status=400)



class ConnectedUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        connections = Connection.objects.filter(
            Q(sender=user) | Q(receiver=user),
            status="accepted"
        ).select_related("sender", "receiver")

        connected_users = []
        for conn in connections:
            other = conn.receiver if conn.sender == user else conn.sender
            connected_users.append({
                "id": other.id,
                "username": other.username
            })

        return Response(connected_users)



class MessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        other_user_id = request.GET.get("user_id")
        if not other_user_id:
            return Response({"error": "user_id required"}, status=400)

        try:
            other_user = User.objects.get(id=other_user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        user = request.user
        messages = Message.objects.filter(
            Q(sender=user, receiver=other_user) |
            Q(sender=other_user, receiver=user)
        ).order_by("timestamp")

        data = [
            {
                "sender": msg.sender.username,
                "receiver": msg.receiver.username,
                "content": msg.content,
                "timestamp": msg.timestamp
            }
            for msg in messages
        ]
        return Response(data)

    def post(self, request):
        user = request.user
        receiver_id = request.data.get("receiver_id")
        content = request.data.get("content")

        if not receiver_id or not content:
            return Response({"error": "receiver_id and content required"}, status=400)

        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({"error": "Receiver not found"}, status=404)

        Message.objects.create(sender=user, receiver=receiver, content=content)
        return Response({"message": "Message sent."}, status=201)


from .models import Post
from rest_framework.permissions import IsAuthenticated

class PostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.all().order_by("-created_at")
        data = [
            {
                "id": post.id,
                "user": post.user.username,
                "content": post.content,
                "created_at": post.created_at
            }
            for post in posts
        ]
        return Response(data)

    def post(self, request):
        content = request.data.get("content")
        if not content:
            return Response({"error": "Content required"}, status=400)

        post = Post.objects.create(user=request.user, content=content)
        return Response({
            "message": "Post created",
            "id": post.id,
            "user": request.user.username,
            "content": post.content,
            "created_at": post.created_at
        }, status=201)



from .models import Comment
from rest_framework.permissions import IsAuthenticated

class CommentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        post_id = request.GET.get("post_id")
        if not post_id:
            return Response({"error": "post_id required"}, status=400)

        comments = Comment.objects.filter(post__id=post_id).order_by("created_at")
        data = [
            {
                "id": comment.id,
                "user": comment.user.username,
                "content": comment.content,
                "created_at": comment.created_at
            }
            for comment in comments
        ]
        return Response(data)

    def post(self, request):
        post_id = request.data.get("post_id")
        content = request.data.get("content")

        if not post_id or not content:
            return Response({"error": "post_id and content required"}, status=400)

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=404)

        Comment.objects.create(post=post, user=request.user, content=content)
        return Response({"message": "Comment added."}, status=201)


from rest_framework import status

class PostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=404)

        if post.user != request.user:
            return Response({"error": "Not authorized"}, status=403)

        post.delete()
        return Response({"message": "Post deleted."}, status=204)

    def put(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=404)

        if post.user != request.user:
            return Response({"error": "Not authorized"}, status=403)

        new_content = request.data.get("content")
        if not new_content:
            return Response({"error": "Content required"}, status=400)

        post.content = new_content
        post.save()

        return Response({"message": "Post updated", "content": post.content})


