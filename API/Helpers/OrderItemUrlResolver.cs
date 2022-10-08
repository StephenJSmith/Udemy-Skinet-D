using API.Dtos;
using AutoMapper;
using Core.Entities.OrderAggregate;

namespace API.Helpers
{
  public class OrderItemUrlResolver : IValueResolver<OrderItem, OrderItemDto, string>
  {
    private readonly IConfiguration _config;

    public OrderItemUrlResolver(IConfiguration config)
    {
      _config = config;

    }

    public string Resolve(
        OrderItem source, 
        OrderItemDto destination, 
        string destMember, 
        ResolutionContext context)
    {
      if (string.IsNullOrWhiteSpace(source?.ItemOrdered?.PictureUrl)) return null;

      var baseUrl = _config["ApiUrl"];
      var url = $"{baseUrl}{source?.ItemOrdered?.PictureUrl}";

      return url;
    }
  }
}