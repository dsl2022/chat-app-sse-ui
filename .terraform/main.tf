provider "aws" {
  region = var.region # Replace with your desired region
}

resource "aws_s3_bucket" "web_bucket" {
  bucket = var.bucket_name # Replace with your desired bucket name
  tags = {
    Name = "Chat app"
  }
}

resource "aws_s3_bucket_acl" "b_acl" {
  bucket = aws_s3_bucket.web_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_website_configuration" "web_bucket_website" {
  bucket = aws_s3_bucket.web_bucket.id

  index_document {
    suffix = "index.html"
  }

  # Optionally, you can also set an error document
  # error_document {
  #   key = "error.html"
  # }
}

# locals {
#   upload_directory = "../${var.static_content_directory}"
#   app_fileset      = fileset(local.upload_directory, "**/*.*")
# }

resource "aws_cloudfront_distribution" "web_distribution" {
  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http2"
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.web_bucket.bucket_domain_name
    origin_id   = aws_s3_bucket.web_bucket.id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.web_identity.cloudfront_access_identity_path
    }
  }
  default_cache_behavior {
    target_origin_id = aws_s3_bucket.web_bucket.id
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    ssl_support_method  = "sni-only"
  }
}

resource "aws_cloudfront_origin_access_identity" "web_identity" {
  comment = "Access Identity for CloudFront"
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.web_distribution.domain_name
}
