module.exports = {
    Content: {
      __resolveType(content, context, info){
        if(content.text){
          return 'ContentText';
        }
  
        if(content.image){
          return 'ContentImage';
        }
  
        return null;
      },
    },
  };