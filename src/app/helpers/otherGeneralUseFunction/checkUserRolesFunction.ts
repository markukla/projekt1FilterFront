import User from '../../Users/users/userTypes/user';
import RoleEnum from '../../Users/users/userTypes/roleEnum';

const UserHasEditorRoleButIsNotAdmin = (user: User): boolean => {
  let isEditorButNotAdmin = false;
  let isAdmin = false;
  let isEditor = false;
  user.roles.forEach(role => {
    if (role.rolename === RoleEnum.ADMIN) {
      isAdmin = true;

    }
    if (role.rolename === RoleEnum.EDITOR) {
      isEditor = true;

    }
  });
  if (isEditor && !isAdmin) {
    isEditorButNotAdmin = true;
  }


  return isEditorButNotAdmin;

};
const UserHasPartnerRole = (user: User): boolean => {
  let isPartner = false;

  user.roles.forEach(role => {
    if (role.rolename === RoleEnum.PARTNER) {
      isPartner = true;

    }
  });


  return isPartner;


};
const UserHasAdminRole = (user: User): boolean => {
  let isAdmin = false;

  user.roles.forEach(role => {
    if (role.rolename === RoleEnum.ADMIN) {
      isAdmin = true;

    }
  });
  return isAdmin;
};
export {UserHasAdminRole, UserHasEditorRoleButIsNotAdmin, UserHasPartnerRole};
