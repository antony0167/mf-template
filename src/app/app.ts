import {Component, OnDestroy, OnInit} from '@angular/core';
import { AppConfig } from '../../../project.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  id = -1;
  receivedId: number | undefined;
  count = 0;

  private intervalId: any;
  private channel: BroadcastChannel | null = null;

  ngOnInit() {
    this.id = Math.ceil(Math.random() * AppConfig.microFrontendCount);
    this.startCommunication();

    if (AppConfig.communicationMethod === 'postMessage') {
      window.addEventListener('message', this.handleMessage);
    } else if (AppConfig.communicationMethod === 'customEvent') {
      window.addEventListener('message', this.handleMessage);
    } else if (AppConfig.communicationMethod === 'broadcastChannel') {
      this.channel = new BroadcastChannel('mf_channel');
      this.channel.onmessage = (event) => this.handleMessage(event as MessageEvent);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (AppConfig.communicationMethod === 'postMessage' || AppConfig.communicationMethod === 'customEvent') {
      window.removeEventListener('message', this.handleMessage);
    }

    if (AppConfig.communicationMethod === 'broadcastChannel') {
      this.channel?.close();
    }
  }

  startCommunication() {
    this.intervalId = setInterval(() => {
      this.sendMessagesToRandom();
    }, AppConfig.messageFrequency);
  }

  sendMessagesToRandom() {
    const targets = this.getRandomTargetIds();

    for (let targetId of targets) {
      const message = {
        type: 'sendMessage',
        detail: {
          name: `data-mf-${this.id}`,
          sourceId: this.id,
          targetId: targetId,
          ts: Date.now(),
          random: Math.random(),
          communicationMethod: AppConfig.communicationMethod
        }
      };

      if (AppConfig.communicationMethod === 'postMessage') {
        window.parent.postMessage(message, 'http://localhost:3000');
      } else if (AppConfig.communicationMethod === 'customEvent') {
        const customEvent = new CustomEvent('mf-message', { detail: message.detail });
        window.parent.dispatchEvent(customEvent);
      } else if (AppConfig.communicationMethod === 'broadcastChannel' && this.channel) {
        this.channel.postMessage(message);
      }

      if (AppConfig.enableLogging) {
        console.log(`mf-${this.id} Sent message to ${targetId}`, message);
      }
    }
  }

  handleMessage = (event: MessageEvent) => {
    const data = event.data?.detail || event.data;

    if (!data || data.sourceId === this.id || data.targetId !== this.id) return;

    this.receivedId = data.sourceId;
    this.count++;

    if (AppConfig.enableLogging) {
      console.log(`mf-${this.id} Received message from ${data.sourceId}`);
    }
  };

  getRandomTargetIds(): number[] {
    const unique: Set<number> = new Set();
    while (unique.size < 5) {
      const candidate = Math.ceil(Math.random() * AppConfig.microFrontendCount);
      if (candidate !== this.id) {
        unique.add(candidate);
      }
    }
    return Array.from(unique);
  }
}

