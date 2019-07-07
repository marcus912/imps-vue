class MainService {
  syncServerCode = (vm) => {
    fetch(vm.domain + '/WIPF/IMPS_API.do?reqCode=checkServerVersion', {
      method: 'POST',
      body: JSON.stringify(vm.$data)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.result === 'Y') {
          if (data.reload === true) {
            // 版本不一致，需更新
            if (data.serverVersion !== undefined) {
              vm.$store.dispatch('updateVersion', {
                version: data.serverVersion
              })
              vm.showLoader()
              var interval = setInterval(() => {
                let c = vm.reloadCountdown--
                if (c >= 0) {
                  vm.$Message.info('系統將在 ' + c + ' 秒後更新')
                } else {
                  clearInterval(interval)
                  window.location.reload()
                  vm.hideLoader()
                }
              }, 1000)
            }
          }
        } else {
          vm.$Message.error(data.errMsg)
        }
      })
      .catch(e => {
        vm.hideLoader(e)
        console.log(e)
      })
  }
}

export default new MainService()
