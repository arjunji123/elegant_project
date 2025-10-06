# Keep Razorpay SDK classes
-keep class com.razorpay.** { *; }
-dontwarn com.razorpay.**

# Keep annotations
-dontwarn proguard.annotation.**
-keep @interface proguard.annotation.Keep
-keep @interface proguard.annotation.KeepClassMembers
