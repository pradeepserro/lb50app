package com.lb50.app

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class ForegroundNotificationPackage : BaseReactPackage() {
  override fun getModule(
    name: String,
    reactContext: ReactApplicationContext,
  ): NativeModule? =
    if (name == ForegroundNotificationModule.NAME) {
      ForegroundNotificationModule(reactContext)
    } else {
      null
    }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
    ReactModuleInfoProvider {
      mapOf(
        ForegroundNotificationModule.NAME to
          ReactModuleInfo(
            ForegroundNotificationModule.NAME,
            ForegroundNotificationModule::class.java.name,
            false,
            false,
            false,
            false,
          ),
      )
    }
}
