from django.db import models
from django.conf import settings


class Post(models.Model):
    author     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    pet        = models.ForeignKey('pets.Pet', on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    content    = models.TextField()
    image      = models.ImageField(upload_to='community/posts/', blank=True, null=True)
    likes      = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.author.username} — {self.content[:50]}'

    @property
    def likes_count(self):
        return self.likes.count()

    class Meta:
        ordering = ['-created_at']


class Comment(models.Model):
    post       = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    content    = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.author.username} on {self.post.id} — {self.content[:50]}'

    class Meta:
        ordering = ['created_at']


class Follow(models.Model):
    follower  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.follower.username} follows {self.following.username}'

    class Meta:
        unique_together = ['follower', 'following']
        ordering = ['-created_at']