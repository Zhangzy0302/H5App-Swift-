<template>
  <div class="agreement-page">

    <!-- 顶部 -->
    <div class="header">
      <BackButton />
      <div class="title">User Agreement</div>
    </div>

    <!-- 内容 -->
    <div class="agreement-content">

      <h1>Sarty User Agreement</h1>

      <p class="update-time">Last updated: 2026</p>

      <p>
        Welcome to <strong>Sarty</strong>. Please read this User Agreement carefully before using the
        Sarty application and services. By accessing or using the service, you agree to be bound
        by this agreement.
      </p>

      <h2>1. Acceptance of Terms</h2>

      <p>
        By creating an account or using Sarty, you confirm that you have read,
        understood, and agreed to comply with this User Agreement and all applicable laws.
      </p>

      <h2>2. Description of Services</h2>

      <p>
        Sarty provides online social interaction services including but not limited to
        messaging, video interaction, profile creation, and virtual item purchases.
      </p>

      <p>
        Sarty reserves the right to modify, suspend, or discontinue any part of the
        services at any time without prior notice.
      </p>

      <h2>3. User Accounts</h2>

      <p>
        You may be required to create an account to access certain features of Sarty.
        You agree to provide accurate and complete information and keep your
        account credentials secure.
      </p>

      <p>
        You are responsible for all activities that occur under your account.
      </p>

      <h2>4. User Conduct</h2>

      <p>Users agree not to:</p>

      <ul>
        <li>Violate any applicable laws or regulations</li>
        <li>Harass, abuse, or harm other users</li>
        <li>Upload illegal, harmful, or offensive content</li>
        <li>Attempt to interfere with the platform's security</li>
      </ul>

      <h2>5. Virtual Items and Purchases</h2>

      <p>
        Sarty may offer virtual items such as diamonds or coins which can be used
        within the platform. These items have no real-world monetary value and
        cannot be redeemed for cash.
      </p>

      <p>
        All purchases are final unless required otherwise by applicable law.
      </p>

      <h2>6. Privacy</h2>

      <p>
        Your privacy is important to us. Please review our Privacy Policy to understand
        how we collect, use, and protect your information.
      </p>

      <h2>7. Termination</h2>

      <p>
        Sarty reserves the right to suspend or terminate your account if you violate
        this agreement or engage in harmful activities.
      </p>

      <h2>8. Disclaimer</h2>

      <p>
        The Sarty service is provided on an "as is" and "as available" basis without
        warranties of any kind.
      </p>

      <h2>9. Changes to This Agreement</h2>

      <p>
        Sarty may update this agreement from time to time. Continued use of the
        service after changes indicates acceptance of the updated terms.
      </p>

      <h2>10. Contact Us</h2>

      <p>
        If you have any questions regarding this agreement, please contact us
        through the application support channel.
      </p>

    </div>

  </div>
</template>

<script setup>
import BackButton from '@/components/back.vue'
</script>

<style scoped>

.agreement-page{
  width:100%;
  height:100vh;
  display:flex;
  flex-direction:column;
  background: linear-gradient(180deg, rgba(255, 190, 25, 1) 0%, rgba(255, 228, 161, 1) 24%, rgba(248, 248, 246, 1) 48%, rgba(248, 248, 246, 1) 100%);
  color: rgba(60, 48, 48, 1);
  overflow: hidden;
}

/* 顶部 */
.header{
  display:flex;
  align-items:center;
  gap:calc(100vw * 12 / 375);
  height: calc(100vh * 88 / 812);
  padding: calc(100vh * 40 / 812) calc(100vw * 20 / 375) 0;
  box-sizing: border-box;
  flex-shrink: 0;
}

.title{
  font-family: 'Poppins-Bold', sans-serif;
  font-size: calc(100vw * 18 / 375);
  line-height: 1;
  color: rgba(60, 48, 48, 1);
}

/* 内容 */
.agreement-content{
  flex:1;
  overflow-y:auto;
  margin: calc(100vh * 16 / 812) calc(100vw * 16 / 375) calc(100vh * 18 / 812);
  padding: calc(100vh * 22 / 812) calc(100vw * 18 / 375) calc(100vh * 28 / 812);
  background: rgba(255, 255, 255, 0.92);
  border-radius: calc(100vw * 16 / 375);
  box-shadow: 0 calc(100vh * 12 / 812) calc(100vw * 28 / 375) rgba(60, 48, 48, 0.08);
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

/* 标题 */
.agreement-content h1{
  font-family: 'Poppins-Bold', sans-serif;
  font-size:calc(100vw * 24 / 375);
  line-height: 1.25;
  margin: 0 0 calc(100vh * 8 / 812);
  color: rgba(60, 48, 48, 1);
}

/* 更新时间 */
.update-time{
  font-family: 'Poppins-Regular', sans-serif;
  font-size:calc(100vw * 12 / 375);
  line-height: 1.5;
  margin: 0 0 calc(100vh * 20 / 812);
  color: rgba(142, 135, 135, 1);
}

/* 小标题 */
.agreement-content h2{
  font-family: 'Poppins-Bold', sans-serif;
  font-size:calc(100vw * 16 / 375);
  line-height: 1.35;
  margin: calc(100vh * 24 / 812) 0 calc(100vh * 8 / 812);
  color: rgba(60, 48, 48, 1);
}

/* 正文 */
.agreement-content p{
  font-family: 'Poppins-Regular', sans-serif;
  font-size:calc(100vw * 14 / 375);
  line-height:1.65;
  margin: 0 0 calc(100vh * 10 / 812);
  color: rgba(92, 84, 84, 1);
}

.agreement-content strong{
  font-family: 'Poppins-Bold', sans-serif;
  color: rgba(60, 48, 48, 1);
}

/* 列表 */
.agreement-content ul{
  padding-left:calc(100vw * 18 / 375);
  margin: 0 0 calc(100vh * 12 / 812);
}

.agreement-content li{
  margin-bottom:calc(100vh * 6 / 812);
  font-family: 'Poppins-Regular', sans-serif;
  font-size:calc(100vw * 14 / 375);
  line-height: 1.55;
  color: rgba(92, 84, 84, 1);
}

.agreement-content li::marker{
  color: rgba(255, 190, 25, 1);
}

</style>
