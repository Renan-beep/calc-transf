
import { Branch, Carrier, HistoryEntry, SystemConfig } from './types';
import { INITIAL_BRANCHES, INITIAL_CARRIERS } from './constants';

const KEYS = {
  BRANCHES: 'logicalc_db_branches',
  CARRIERS: 'logicalc_db_carriers',
  HISTORY: 'logicalc_db_history',
  CONFIG: 'logicalc_db_config',
  USERS: 'logicalc_db_users',
  AUTH: 'logicalc_db_auth_token'
};

class Database {
  // --- Generic Helpers ---
  private getItem<T>(key: string, defaultValue: T): T {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // --- Branches ---
  getBranches(): Branch[] {
    return this.getItem<Branch[]>(KEYS.BRANCHES, INITIAL_BRANCHES);
  }

  saveBranches(branches: Branch[]): void {
    this.setItem(KEYS.BRANCHES, branches);
  }

  // --- Carriers ---
  getCarriers(): Carrier[] {
    return this.getItem<Carrier[]>(KEYS.CARRIERS, INITIAL_CARRIERS);
  }

  saveCarriers(carriers: Carrier[]): void {
    this.setItem(KEYS.CARRIERS, carriers);
  }

  // --- History ---
  getHistory(): HistoryEntry[] {
    return this.getItem<HistoryEntry[]>(KEYS.HISTORY, []);
  }

  addHistory(entry: HistoryEntry): void {
    const history = this.getHistory();
    const updated = [entry, ...history].slice(0, 50);
    this.setItem(KEYS.HISTORY, updated);
  }

  // --- System Config ---
  getConfig(): SystemConfig {
    return this.getItem<SystemConfig>(KEYS.CONFIG, {
      companyName: 'LogiCalc',
      logoUrl: ''
    });
  }

  saveConfig(config: SystemConfig): void {
    this.setItem(KEYS.CONFIG, config);
  }

  // --- Users & Auth ---
  getUsers(): any[] {
    return this.getItem<any[]>(KEYS.USERS, []);
  }

  addUser(user: any): boolean {
    const users = this.getUsers();
    if (users.find(u => u.username === user.username) || user.username === 'admin') {
      return false;
    }
    this.setItem(KEYS.USERS, [...users, user]);
    return true;
  }

  authenticate(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') return true;
    const users = this.getUsers();
    return users.some(u => u.username === username && u.password === password);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(KEYS.AUTH) === 'true';
  }

  setAuthenticated(status: boolean): void {
    if (status) {
      localStorage.setItem(KEYS.AUTH, 'true');
    } else {
      localStorage.removeItem(KEYS.AUTH);
    }
  }

  // --- Utility ---
  clearAll(): void {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
    window.location.reload();
  }
}

export const db = new Database();
