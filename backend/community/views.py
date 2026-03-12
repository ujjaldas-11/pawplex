from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Post, Comment, Follow
from .serializers import (
    PostSerializer,
    PostListSerializer,
    CommentSerializer,
    FollowSerializer,
)
from accounts.models import User


class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        # If authenticated — show posts from followed users + own posts
        if user.is_authenticated:
            following_ids = Follow.objects.filter(
                follower=user
            ).values_list('following_id', flat=True)
            return Post.objects.filter(
                author_id__in=list(following_ids) + [user.id]
            )
        # If not authenticated — show all posts
        return Post.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return PostListSerializer
        return PostSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    # POST /api/community/posts/{id}/like/
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        if post.likes.filter(id=request.user.id).exists():
            # Unlike
            post.likes.remove(request.user)
            return Response({'message': 'Unliked', 'likes_count': post.likes_count})
        else:
            # Like
            post.likes.add(request.user)
            return Response({'message': 'Liked', 'likes_count': post.likes_count})

    # GET/POST /api/community/posts/{id}/comments/
    @action(detail=True, methods=['get', 'post'], permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def comments(self, request, pk=None):
        post = self.get_object()

        if request.method == 'GET':
            comments   = post.comments.all()
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)

        if request.method == 'POST':
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(author=request.user, post=post)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FollowViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    # POST /api/community/follow/{user_id}/
    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        target_user = get_object_or_404(User, pk=pk)

        if target_user == request.user:
            return Response(
                {'error': 'You cannot follow yourself'},
                status=status.HTTP_400_BAD_REQUEST
            )

        follow = Follow.objects.filter(follower=request.user, following=target_user)

        if follow.exists():
            follow.delete()
            return Response({'message': f'Unfollowed {target_user.username}'})
        else:
            Follow.objects.create(follower=request.user, following=target_user)
            return Response({'message': f'Following {target_user.username}'})



