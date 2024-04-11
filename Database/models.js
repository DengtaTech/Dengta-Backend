const sequelizes = require('../config/db');
const User = require('./Entities/users');
const Followship = require('./Entities/followship');
const Footprint = require('./Entities/footprints');
const FootprintReaction = require('./Entities/footprintReactions');
const FootprintHashTag = require('./Entities/footprintHashTags');
const FootprintTagType = require('./Entities/footprintTagType');
const ReactionType = require('./Entities/reactionType');
const UserCredential = require('./Entities/userCredentials');
const ProfileHashTag = require('./Entities/profileHashTags');
const ProfileTagType = require('./Entities/profileTagType');
const Notification = require('./Entities/notifications');
const UserRole = require('./Entities/userRoles');
const Role = require('./Entities/roles');
// Users-UserCredentials 1-1
User.hasOne(UserCredential,{foreignKey: 'userId'});
UserCredential.belongsTo(User,{foreignKey: 'userId'})

// Users-Notifications 1-M
User.hasMany(Notification,{foreignKey: 'userId'});
Notification.belongsTo(User,{foreignKey: 'userId'});

// Users-UserRoles-Roles
User.belongsToMany(Role,{
    through: UserRole,
    foreignKey: 'userId',
    otherKey: 'roleId'
});
Role.belongsToMany(User,{
    through: UserRole,
    foreignKey: 'roleId',
    otherKey: 'userId'
});

User.hasMany(UserRole,{ foreignKey: 'userId' });
UserRole.belongsTo(User,{ foreignKey: 'userId' });

Role.hasMany(UserRole,{ foreignKey: 'roleId' });
UserRole.belongsTo(Role,{ foreignKey: 'roleId' });

// Users-ProfileTagType super M-M
User.belongsToMany(ProfileTagType,{
    through: ProfileHashTag,
    foreignKey: 'userId',
    otherKey: 'profileTagTypeId'
});
ProfileTagType.belongsToMany(User,{
    through: ProfileHashTag,
    foreignKey: 'profileTagTypeId',
    otherKey: 'userId'
});

User.hasMany(ProfileHashTag,{ foreignKey: 'userId' });
ProfileHashTag.belongsTo(User,{ foreignKey: 'userId' });

ProfileTagType.hasMany(ProfileHashTag,{ foreignKey: 'profileTagTypeId' });
ProfileHashTag.belongsTo(ProfileTagType,{ foreignKey: 'profileTagTypeId' })

//Users-UserFollows self ref
User.hasMany(Followship,{ foreignKey: 'followerId', as: 'followerFollowship'});
Followship.belongsTo(User,{ foreignKey: 'followerId', as: 'followerUser'});

User.hasMany(Followship,{ foreignKey: 'followeeId', as: 'followeeFollowship'});
Followship.belongsTo(User,{ foreignKey: 'followeeId', as: 'followeeUser'});

//Users-Footprints 1-M
User.hasMany(Footprint,{ foreignKey: 'userId' });
Footprint.belongsTo(User, { foreignKey: 'userId' });

//Users-FootprintReactions-Footprints super M-M
User.belongsToMany(Footprint,{
    through: FootprintReaction,
    foreignKey: 'userId',
    otherKey: 'footprintId'
});
Footprint.belongsToMany(User,{
    through: FootprintReaction,
    foreignKey: 'footprintId',
    otherKey: 'userId'
});

User.hasMany(FootprintReaction,{ foreignKey: 'userId' });
FootprintReaction.belongsTo(User,{ foreignKey: 'userId' });

Footprint.hasMany(FootprintReaction,{ foreignKey: 'footprintId' });
FootprintReaction.belongsTo(Footprint,{ foreignKey: 'footprintId' });

//Footprints-FootprintHashTags-FootprintTagType
Footprint.belongsToMany(FootprintTagType,{
    through: FootprintHashTag,
    foreignKey: 'footprintId',
    otherKey: 'footprintTagTypeId'
});
FootprintTagType.belongsToMany(Footprint,{
    through: FootprintHashTag,
    foreignKey: 'footprintTagTypeId',
    otherKey: 'footprintId'
});

Footprint.hasMany(FootprintHashTag,{ foreignKey: 'footprintId' });
FootprintHashTag.belongsTo(Footprint,{ foreignKey: 'footprintId' });

FootprintTagType.hasMany(FootprintHashTag,{ foreignKey: 'footprintTagTypeId' });
FootprintHashTag.belongsTo(FootprintTagType,{ foreignKey: 'footprintTagTypeId' });

//ReactionType-FootprintReactions 1-M
ReactionType.hasMany(FootprintReaction,{ foreignKey: 'reactionTypeId' });
FootprintReaction.belongsTo(ReactionType, { foreignKey: 'reactionTypeId' });



module.exports = {
    initDb: async()=>{
        try {
            await sequelizes.sync({alter: true});
            console.log('All models were synchronized successfully.');
          } catch (error) {
            console.error('Failed to synchronize models:', error);
          }
    }
}