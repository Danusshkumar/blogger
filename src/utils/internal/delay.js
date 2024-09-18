/**
 * 
 *
 * @param timeout  
 * @return {Promise<any>}
 */
function delay(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default delay;