using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
  public class ProductUrlResolver : IValueResolver<Product, ProductToReturnDto, string>
  {
    private readonly IConfiguration _config;

    public ProductUrlResolver(IConfiguration config)
    {
      _config = config;
    }

    public string Resolve(
        Product source, 
        ProductToReturnDto destination, 
        string destMember, 
        ResolutionContext context)
    {
      if (string.IsNullOrWhiteSpace(source.PictureUrl)) return null;
    
      var baseUrl = _config["ApiUrl"];
      var url = $"{baseUrl}{source.PictureUrl}";

      return url;
    }
  }
}