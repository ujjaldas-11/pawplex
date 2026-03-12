# community/admin.py

from django.contrib import admin
from .models import Post, Comment, Follow


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display  = ['author', 'pet', 'likes_count', 'created_at']
    search_fields = ['author__username', 'content']
    inlines       = [CommentInline]


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display  = ['author', 'post', 'created_at']
    search_fields = ['author__username', 'content']


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display  = ['follower', 'following', 'created_at']
    search_fields = ['follower__username', 'following__username']