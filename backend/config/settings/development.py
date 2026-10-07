from .base import *

DEBUG = True

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
]
# ==========================================
# ==========================================
# EMAIL CONFIGURATION
# ==========================================

MAILERS = {
    "default": {
        "BACKEND": "django.core.mail.backends.smtp.EmailBackend",
        "OPTIONS": {
            "host": "smtp.gmail.com",
            "port": 587,
            "use_tls": True,
            "username": "despacitoganesh@gmail.com",
            "password": "qdrn lxyy dazl puje",
        },
    },
}

DEFAULT_FROM_EMAIL = "despacitoganesh@gmail.com"