from rest_framework import serializers
from .models import Post, Comment, Follow



class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model  = Comment
        fields = ['id', 'post', 'author', 'author_username', 'content', 'created_at']
        read_only_fields = ['id', 'author', 'post', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username',  read_only=True)
    pet_name        = serializers.CharField(source='pet.name',         read_only=True)
    likes_count     = serializers.IntegerField(read_only=True)
    comments        = CommentSerializer(many=True, read_only=True)
    is_liked        = serializers.SerializerMethodField()

    class Meta:
        model  = Post
        fields = [
            'id', 'author', 'author_username',
            'pet', 'pet_name', 'content', 'image',
            'likes_count', 'is_liked', 'comments',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False


class PostListSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    likes_count     = serializers.IntegerField(read_only=True)
    comments_count  = serializers.SerializerMethodField()
    is_liked        = serializers.SerializerMethodField()

    class Meta:
        model  = Post
        fields = [
            'id', 'author_username', 'pet',
            'content', 'image', 'likes_count',
            'comments_count', 'is_liked', 'created_at',
        ]

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False


class FollowSerializer(serializers.ModelSerializer):
    follower_username  = serializers.CharField(source='follower.username',  read_only=True)
    following_username = serializers.CharField(source='following.username', read_only=True)

    class Meta:
        model  = Follow
        fields = ['id', 'follower', 'follower_username', 'following', 'following_username', 'created_at']
        read_only_fields = ['id', 'follower', 'created_at']