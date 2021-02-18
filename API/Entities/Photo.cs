using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    // To call photos collection(Table) as Photos. 
    // This will create seperate table for the collection of photos in Database
    [Table("Photos")]
    public class Photo
    {
        public int Id { get; set; }

        public string Url { get; set; }

        public bool IsMain { get; set; }

        public string PublicId { get; set; }

        public AppUser AppUser { get; set; }

        public int AppUserId { get; set; }
    }
}