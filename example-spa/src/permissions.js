const permissions = {
    allowed: (g1, g2) => g1.find(x => g2.includes(x)) // get first group that matches
}
  
export default permissions
  