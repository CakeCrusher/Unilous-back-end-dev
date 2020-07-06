module.exports = {
    Content: {
      __resolveType(content, context, info){
        if(content.text){
          return 'ContentText';
        }
  
        if(content.image){
          return 'ContentImage';
        }
  
        throw new Error('Content type cannot be resolved')
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
  
        throw new Error('Notification type cannot be resolved')
      },
    },
  };