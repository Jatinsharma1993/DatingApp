using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IMapper _mapper;

        private readonly IPhotoService _photoService;

        private readonly IUserRepository _userRepository;
        public UsersController(IUserRepository userRepository, IMapper mapper , IPhotoService  photoService)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _photoService = photoService;
        }



        [HttpGet]

        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();
            
            return Ok(users);

        }


        // api/users/dona
        [HttpGet("{username}" , Name = "GetUser")]

        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }


        [HttpPut]

        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.GetUsername();

            var user = await _userRepository.GetUserByUsernameAsync(username);

            _userRepository.Update(user);

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("User is not Updated");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
           var username = User.GetUsername();

           var user = await _userRepository.GetUserByUsernameAsync(username);

           var results = await _photoService.AddPhotoAsync(file);

           if(results.Error != null) return BadRequest(results.Error.Message);

           var photo = new Photo
           {
               Url = results.SecureUrl.AbsoluteUri,
               PublicId = results.PublicId
           };

           if(user.Photos.Count == 0)
           {
               photo.IsMain = true;
           }

           user.Photos.Add(photo);

           if(await _userRepository.SaveAllAsync()) 
           {
           
            return CreatedAtRoute("GetUser",new {username = user.UserName},_mapper.Map<PhotoDto>(photo));
            
           }
           return BadRequest("Problem Uploading Photos");

        }

        [HttpPut("set-main-photo/{photoId}")]

        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if(photo.IsMain) return BadRequest("This is already your Main photo");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

            if(currentMain != null) currentMain.IsMain = false;

            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set main photo");
           
        }

        [HttpDelete("delete-photo/{photoId}")]

        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

           var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

           if(photo == null) return NotFound();

           if(photo.IsMain) return  BadRequest("You cannot delete the main photo");

           if(photo.PublicId != null) 
           {
               var result = await _photoService.DeletePhotoAsync(photo.PublicId);
               if(result.Error != null) return BadRequest(result.Error.Message);
           }

           user.Photos.Remove(photo);

           if(await _userRepository.SaveAllAsync()) return Ok();

           return BadRequest("Failed to delete the photo"); 
        }
    }
}