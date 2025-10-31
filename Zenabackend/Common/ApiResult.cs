namespace Zenabackend.Common;

public class ApiResult<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public int StatusCode { get; set; }

    public static ApiResult<T> Ok(T data, string? message = null)
    {
        return new ApiResult<T>
        {
            Success = true,
            Data = data,
            Message = message,
            StatusCode = 200
        };
    }

    public static ApiResult<T> BadRequest(string message, int statusCode = 400)
    {
        return new ApiResult<T>
        {
            Success = false,
            Message = message,
            StatusCode = statusCode
        };
    }

    public static ApiResult<T> Unauthorized(string message = "Unauthorized")
    {
        return new ApiResult<T>
        {
            Success = false,
            Message = message,
            StatusCode = 401
        };
    }

    public static ApiResult<T> NotFound(string message = "Not Found")
    {
        return new ApiResult<T>
        {
            Success = false,
            Message = message,
            StatusCode = 404
        };
    }
}

