from django.urls import path
from .views import RegisterView, LoginView, ProfileView, UpdateProfileView, UserListView
from .views import ConnectView
from .views import IncomingRequestsView
from .views import ConnectedUsersView
from .views import MessageView
from .views import PostView
from .views import CommentView
from .views import PostDetailView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('update-profile/', UpdateProfileView.as_view()),
    path('users/', UserListView.as_view()),
    path('connect/', ConnectView.as_view()),
    path('connections/incoming/', IncomingRequestsView.as_view()),
    path('connections/accepted/', ConnectedUsersView.as_view()),
    path('messages/', MessageView.as_view()),
    path('posts/', PostView.as_view()),
    path('comments/', CommentView.as_view()),
    path('posts/<int:post_id>/', PostDetailView.as_view()),
]
