import { createApp } from 'vue';
import './starpet-shell.css';

// 第 0 期只有星芽桌面外壳；守护进程与网关接入后再加主窗口。
document.documentElement.dataset.view = 'starpet';
void import('./components/StarPetDesktop.vue').then(({ default: root }) => createApp(root).mount('#app'));
