class LoginService {
  direct = ({userInfo, vm}) => {
    if (userInfo.indexPage.indexOf('.do') === -1) {
      vm.$router.push(userInfo.indexPage)
    } else {
      // alert(vm.$store.state.domain + '/WIPF/templates/SSO/IMPSSSO.jsp?username=' + userInfo.guuserName + '&password=' + vm.$data.password + '&page=' + userInfo.indexPage)
      window.location = vm.$store.state.domain + '/WIPF/templates/SSO/IMPSSSO.jsp?username=' + userInfo.guuserName + '&password=' + vm.$data.password + '&page=' + userInfo.indexPage
    }
  }
}

export default new LoginService()
