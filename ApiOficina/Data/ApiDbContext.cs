namespace ApiOficina.Data;

using Microsoft.EntityFrameworkCore;
using ApiOficina.Models;

public class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {
    }
    public DbSet<MotoEntity> Motos => Set<MotoEntity>();
}
