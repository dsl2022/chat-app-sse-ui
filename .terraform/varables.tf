variable "mime_types" {
  default = {
    htm  = "text/html"
    html = "text/html"
    css  = "text/css"
    ttf  = "font/ttf"
    js   = "application/javascript"
    map  = "application/javascript"
    json = "application/json"
    txt  = "text/plain"
    png  = "image/png"
    jpg  = "image/jpg"
    ico  = "image/ico"
    svg  = "image/svg+xml" // Added svg MIME type
  }
}

variable "bucket_name" {
  type        = string
  description = "bucket name"
}

variable "region" {
  type        = string
  description = "region"
  default     = "us-east-1"
}

variable "static_content_directory" {
  type        = string
  description = "region"
}
