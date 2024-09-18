/**
 * checkImageUrlIsValid() 
 *
 * @param url  
 * @return {Promise<any>}
 */
function checkImageUrlIsValid(url) {
  return new Promise(function(resolve, reject) {
    const img = new Image();
    img.onload = function() {
      resolve(url);
    };

    img.onerror = function(){
      reject('The url of image is invalid.');
    };

    img.src = url;
  });
}

export default checkImageUrlIsValid;