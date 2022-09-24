using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
  public class StoreContext : DbContext
  {
    public StoreContext(DbContextOptions<StoreContext> options) : base(options)
    {  }
    
    private readonly string _connectionString;

    public DbSet<Product> Products { get; set; }
  }
}