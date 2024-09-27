import request from '@/utils/request';
import { parseStrEmpty } from '@/utils/ruoyi';

// 查询用户列表
export function listUser(query) {
    return request({
        url: '/system/user/list',
        method: 'get',
        params: query,
    });
}

// 查询终端用户列表
export function terminalUserList(query) {
    return request({
        url: '/system/user/listTerminal',
        method: 'get',
        params: query,
    });
}
// 查询用户详细
export function getUser(userId) {
    return request({
        url: '/system/user/' + parseStrEmpty(userId),
        method: 'get',
    });
}

// 查询角色列表
export function getRole(deptId) {
    return request({
        url: '/system/dept/getRole?deptId=' + deptId,
        method: 'get',
    });
}

// 新增用户
export function addUser(data) {
    return request({
        url: '/system/user',
        method: 'post',
        data: data,
    });
}

// 修改用户
export function updateUser(data) {
    return request({
        url: '/system/user',
        method: 'put',
        data: data,
    });
}

// 删除用户
export function delUser(userId) {
    return request({
        url: '/system/user/' + userId,
        method: 'delete',
    });
}

// 用户密码重置
export function resetUserPwd(userId, password) {
    const data = {
        userId,
        password,
    };
    return request({
        url: '/system/user/resetPwd',
        method: 'put',
        data: data,
    });
}

// 用户状态修改
export function changeUserStatus(userId, status) {
    const data = {
        userId,
        status,
    };
    return request({
        url: '/system/user/changeStatus',
        method: 'put',
        data: data,
    });
}
// 获取微信二维码
export function getLoginParam() {
    return request({
        url: '/wechat/getWxBindQr',
        method: 'get',
    });
}
// 解除绑定
export function secureBind(data) {
    return request({
        url: '/wechat/cancelBind',
        method: 'post',
        data: data,
    });
}
// 查询用户个人信息
export function getUserProfile() {
    return request({
        url: '/system/user/profile',
        method: 'get',
    });
}

// 修改用户个人信息
export function updateUserProfile(data) {
    return request({
        url: '/system/user/profile',
        method: 'put',
        data: data,
    });
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
    const data = {
        oldPassword,
        newPassword,
    };
    return request({
        url: '/system/user/profile/updatePwd',
        method: 'put',
        params: data,
    });
}

// 用户头像上传
export function uploadAvatar(data) {
    return request({
        url: '/system/user/profile/avatar',
        method: 'post',
        data: data,
    });
}

// 查询授权角色
export function getAuthRole(userId) {
    return request({
        url: '/system/user/authRole/' + userId,
        method: 'get',
    });
}

// 保存授权角色
export function updateAuthRole(data) {
    return request({
        url: '/system/user/authRole',
        method: 'put',
        params: data,
    });
}

// 查询机构下拉树结构
export function deptsTreeSelect() {
    return request({
        url: '/system/user/deptTree',
        method: 'get',
    });
}

// 查询子机构下拉树结构
export function deptsTreeSelectSub(showOwner) {
    return request({
        url: '/system/user/deptTree?showOwner=' + showOwner,
        method: 'get',
    });
}

// 查询终端用户列表
export function getByDeptId(query) {
  return request({
    url: '/system/user/getByDeptId',
    method: 'get',
    params: query,
  });
}