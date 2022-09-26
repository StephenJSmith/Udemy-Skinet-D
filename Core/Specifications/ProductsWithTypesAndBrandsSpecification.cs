using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
  public class ProductsWithTypesAndBrandsSpecification
    : BaseSpecification<Product>
  {
    public ProductsWithTypesAndBrandsSpecification(
      ProductSpecParams productParams)
      : base(x => 
        (string.IsNullOrWhiteSpace(productParams.Search) 
          || x.Name.ToLower().Contains(productParams.Search))
        && (!productParams.BrandId.HasValue 
          || x.ProductBrandId == productParams.BrandId)
        && (!productParams.TypeId.HasValue 
          || x.ProductTypeId == productParams.TypeId)
      )
    {
        AddInclude(x => x.ProductType);
        AddInclude(x => x.ProductBrand);
        AddOrderBy(x => x.Name);
        
        var skip = productParams.PageSize * (productParams.PageIndex - 1);
        var take = productParams.PageSize;
        ApplyPaging(skip, take);

        if (!string.IsNullOrWhiteSpace(productParams.Sort))
        {
          switch (productParams.Sort) {
            case "priceAsc":
              AddOrderBy(p => p.Price);
              break;

            case "priceDesc":
              AddOrderByDescending(p => p.Price);
              break;

            default:
              AddOrderBy(n => n.Name);
              break;
          }
        }
    }

    public ProductsWithTypesAndBrandsSpecification(int id) 
        : base(x => x.Id == id)
    {
        AddInclude(x => x.ProductType);
        AddInclude(x => x.ProductBrand);
    }
  }
}