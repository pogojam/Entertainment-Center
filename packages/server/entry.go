package main

import (
	"net/http"
  "google.golang.org/grpc"
	"github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"data": "hello world"})    
  })

  r.Run("0.0.0.0:5000")
}
