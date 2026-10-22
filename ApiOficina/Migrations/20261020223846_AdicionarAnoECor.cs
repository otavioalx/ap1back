using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiOficina.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarAnoECor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Ano",
                table: "Motos",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Cor",
                table: "Motos",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ano",
                table: "Motos");

            migrationBuilder.DropColumn(
                name: "Cor",
                table: "Motos");
        }
    }
}
