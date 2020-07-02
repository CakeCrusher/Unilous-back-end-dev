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

    Notification: {
      __resolveType(notification, context, info){
        if(notification.question){
          return 'QuestionNotification';
        }
  
        if(notification.skill_joining){
          return 'JoinRequestNotification';
        }
  
        return null;
      },
    },
  };