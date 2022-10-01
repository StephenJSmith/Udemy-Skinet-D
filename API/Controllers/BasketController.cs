using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class BasketController : BaseApiController
  {
    private readonly IBasketRepository _basketRepository;

    public BasketController(IBasketRepository basketRepository)
    {
        _basketRepository = basketRepository;
    }

    [HttpGet]
    public async Task<ActionResult<CustomerBasket>> GetBasketById(string id) {
        var basket = await _basketRepository.GetBasketAsync(id);
        var returnBasket = basket ?? new CustomerBasket(id);

        return Ok(returnBasket);
    }

    [HttpPost]
    public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasket basket) {
        var updatedBasket = await _basketRepository.UpdateBasketAsync(basket);

        return Ok(updatedBasket);
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteBasket(string id) {
        await _basketRepository.DeleteBasketAsync(id);

        return Ok();
    }
  }
}