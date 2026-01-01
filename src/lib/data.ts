
import type { LucideIcon } from 'lucide-react';
import { Bitcoin, CircleDollarSign, Smartphone, Globe, Laptop } from 'lucide-react';

export const investmentChartData = [
  { month: 'Jan', marketValue: 2000, deposits: 500, withdrawals: 100 },
  { month: 'Feb', marketValue: 2400, deposits: 300, withdrawals: 50 },
  { month: 'Mar', marketValue: 2200, deposits: 600, withdrawals: 200 },
  { month: 'Apr', marketValue: 2800, deposits: 200, withdrawals: 150 },
  { month: 'May', marketValue: 3200, deposits: 700, withdrawals: 0 },
  { month: 'Jun', marketValue: 3500, deposits: 400, withdrawals: 300 },
  { month: 'Jul', marketValue: 4100, deposits: 800, withdrawals: 100 },
  { month: 'Aug', marketValue: 3900, deposits: 300, withdrawals: 400 },
  { month: 'Sep', marketValue: 4500, deposits: 1000, withdrawals: 200 },
  { month: 'Oct', marketValue: 4700, deposits: 500, withdrawals: 50 },
  { month: 'Nov', marketValue: 4600, deposits: 200, withdrawals: 100 },
  { month: 'Dec', marketValue: 5200, deposits: 1200, withdrawals: 300 },
];

export const accountActivityData = [
  { date: 'Jan 1', balance: 0 },
  { date: 'Jan 5', balance: 100, deposit: 100 },
  { date: 'Jan 10', balance: 100, investment: 100 }, // Investment doesn't change total balance
  { date: 'Jan 15', balance: 300 }, // Represents earnings of 200
  { date: 'Jan 20', balance: 250, withdrawal: 250 },
  { date: 'Jan 25', balance: 250, investment: 250 },
  { date: 'Jan 30', balance: 350 }, // Represents earnings
];

export const platformGrowthData = [
  { month: 'Jan', totalCapital: 800000, totalPayout: 200000 },
  { month: 'Feb', totalCapital: 850000, totalPayout: 220000 },
  { month: 'Mar', totalCapital: 920000, totalPayout: 250000 },
  { month: 'Apr', totalCapital: 1000000, totalPayout: 280000 },
  { month: 'May', totalCapital: 1100000, totalPayout: 300000 },
  { month: 'Jun', totalCapital: 1250000, totalPayout: 345000 },
];


export type Investment = {
  id: string;
  name: string;
  Icon: LucideIcon;
  price: number;
  change: number;
  holdingsValue: number;
  holdingsAmount: string;
}

export const cryptoInvestments: Investment[] = [
    { id: 'BTC', name: 'Bitcoin', Icon: Bitcoin, price: 68123.45, change: 2.3, holdingsValue: 45678.12, holdingsAmount: '0.6705 BTC' },
    { id: 'ETH', name: 'Ethereum', Icon: CircleDollarSign, price: 3543.21, change: -1.2, holdingsValue: 23456.78, holdingsAmount: '6.620 ETH' },
    { id: 'SOL', name: 'Solana', Icon: CircleDollarSign, price: 168.90, change: 5.1, holdingsValue: 5678.90, holdingsAmount: '33.62 SOL' },
];

export const stockInvestments: Investment[] = [
    { id: 'AAPL', name: 'Apple Inc.', Icon: Smartphone, price: 195.89, change: 1.5, holdingsValue: 15678.40, holdingsAmount: '80 Shares' },
    { id: 'GOOGL', name: 'Alphabet Inc.', Icon: Globe, price: 177.37, change: -0.8, holdingsValue: 12345.60, holdingsAmount: '69 Shares' },
    { id: 'MSFT', name: 'Microsoft Corp.', Icon: Laptop, price: 427.56, change: 0.5, holdingsValue: 18765.30, holdingsAmount: '43 Shares' },
];

export const totalBalance = cryptoInvestments.reduce((sum, item) => sum + item.holdingsValue, 0) + stockInvestments.reduce((sum, item) => sum + item.holdingsValue, 0);
export const availableBalance = 15234.56;
export const pendingDeposits = 1200;
export const pendingWithdrawals = 500;
export const activeInvestments = 8;
export const newUsers = 15;
export const newInvestments = 25;
export const totalCapital = 1250000;
export const totalPayout = 345000;


export type InvestmentPlan = {
  id: string;
  offerer: string;
  type: string;
  roi: string;
  range: string;
  features: string[];
};

export const investmentPlans: InvestmentPlan[] = [
  {
    id: "ap-company-bond",
    offerer: "A&P Company",
    type: "Corporate Bond",
    roi: "15% fixed return",
    range: "$1,000+",
    features: ["30-day term", "Principal returned", "Low risk"]
  },
  {
    id: "cryptohouse-eth-staking",
    offerer: "CryptoHouse Brokerage",
    type: "ETH Staking",
    roi: "Up to 8% APY",
    range: "$500 - $10,000",
    features: ["Variable returns", "Compounding interest", "24/7 Support"]
  },
  {
    id: "innovate-tech-portfolio",
    offerer: "Innovate Inc.",
    type: "Tech Stock Portfolio",
    roi: "25% projected annual",
    range: "$5,000+",
    features: ["High growth potential", "Diversified tech stocks", "Long-term hold"]
  }
];

export const userProfile = {
  name: "John Doe",
  username: "@john.doe",
  email: "john.doe@example.com",
  avatarUrl: "https://picsum.photos/seed/123/100/100"
};

export type Transaction = {
  id: string;
  date: string;
  type: 'Deposit' | 'Withdrawal' | 'Investment';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  details: string;
};

export const transactionHistory: Transaction[] = [
  { id: 'txn1', date: '2023-10-26', type: 'Deposit', amount: 1200.00, status: 'Completed', details: 'BTC Deposit' },
  { id: 'txn2', date: '2023-10-25', type: 'Investment', amount: 5000.00, status: 'Completed', details: 'Innovate Tech Portfolio' },
  { id: 'txn3', date: '2023-10-24', type: 'Withdrawal', amount: 500.00, status: 'Pending', details: 'ETH to 0x...88' },
  { id: 'txn4', date: '2023-10-23', type: 'Deposit', amount: 300.00, status: 'Completed', details: 'ETH Deposit' },
  { id: 'txn5', date: '2023-10-22', type: 'Investment', amount: 1000.00, status: 'Pending', details: 'A&P Company Bond' },
  { id: 'txn6', date: '2023-10-21', type: 'Withdrawal', amount: 2000.00, status: 'Completed', details: 'BTC to 1A...Na' },
  { id: 'txn7', date: '2023-10-20', type: 'Deposit', amount: 750.00, status: 'Failed', details: 'Card Deposit' },
  { id: 'txn8', date: '2023-10-19', type: 'Investment', amount: 750.00, status: 'Completed', details: 'CryptoHouse ETH Staking' },
  { id: 'txn9', date: '2023-10-28', type: 'Deposit', amount: 2500.00, status: 'Pending', details: 'SOL Deposit' },
  { id: 'txn10', date: '2023-10-29', type: 'Investment', amount: 2000.00, status: 'Pending', details: 'New Tech Fund' },
  { id: 'txn11', date: '2023-10-30', type: 'Deposit', amount: 150.00, status: 'Pending', details: 'USDC Deposit' },
  { id: 'txn12', date: '2023-11-01', type: 'Deposit', amount: 1800.00, status: 'Pending', details: 'Bank Transfer' },
  { id: 'txn13', date: '2023-11-02', type: 'Investment', amount: 3000.00, status: 'Pending', details: 'Global Real Estate Fund' },
];

export type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
};

export const notifications: Notification[] = [
    {
        id: "notif1",
        title: "Deposit Confirmed",
        message: "Your deposit of 0.05 BTC has been confirmed and added to your account.",
        timestamp: "2 hours ago",
        read: false
    },
    {
        id: "notif2",
        title: "New Investment Opportunity",
        message: "Check out the new high-yield bond from Innovate Inc. with a projected 25% annual return.",
        timestamp: "8 hours ago",
        read: false
    },
    {
        id: "notif3",
        title: "Withdrawal Processed",
        message: "Your withdrawal request of $500 has been successfully processed.",
        timestamp: "1 day ago",
        read: true
    },
    {
        id: "notif4",
        title: "Security Alert: New Login",
        message: "Your account was accessed from a new device in London, UK. If this wasn't you, please secure your account immediately.",
        timestamp: "3 days ago",
        read: false
    },
    {
        id: "notif5",
        title: "Welcome to InvestView!",
        message: "Thank you for joining InvestView. Start by exploring our investment opportunities or depositing funds.",
        timestamp: "1 week ago",
        read: true
    }
];

export const adminNotifications: Notification[] = [
    {
        id: "admin_notif1",
        title: "New User Registration",
        message: "A new user, Alice Johnson (alice.j@example.com), has registered on the platform and is awaiting account verification.",
        timestamp: "5 minutes ago",
        read: false
    },
    {
        id: "admin_notif2",
        title: "Large Deposit Pending",
        message: "A deposit of $25,000 from user 'jane.smith' is pending confirmation. Please review and approve.",
        timestamp: "30 minutes ago",
        read: false
    },
    {
        id: "admin_notif3",
        title: "System Maintenance Required",
        message: "The database server is reporting high CPU usage. A restart is recommended during off-peak hours.",
        timestamp: "1 hour ago",
        read: true
    },
    {
        id: "admin_notif4",
        title: "Failed Withdrawal Attempt",
        message: "User 'rob.brown' had a withdrawal of $5,000 fail due to an invalid wallet address.",
        timestamp: "4 hours ago",
        read: false
    },
];

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  joinDate: string;
  totalBalance: number;
  status: 'Active' | 'Suspended' | 'Pending';
};

export const users: User[] = [
  { id: 'user1', name: 'John Doe', username: '@john.doe', email: 'john.doe@example.com', avatarUrl: 'https://picsum.photos/seed/1/100/100', joinDate: '2023-10-01', totalBalance: 87456.21, status: 'Active' },
  { id: 'user2', name: 'Jane Smith', username: '@jane.smith', email: 'jane.smith@example.com', avatarUrl: 'https://picsum.photos/seed/2/100/100', joinDate: '2023-09-15', totalBalance: 123890.50, status: 'Active' },
  { id: 'user3', name: 'Alice Johnson', username: '@alice.j', email: 'alice.j@example.com', avatarUrl: 'https://picsum.photos/seed/3/100/100', joinDate: '2023-10-28', totalBalance: 5200.00, status: 'Pending' },
  { id: 'user4', name: 'Robert Brown', username: '@rob.brown', email: 'rob.brown@example.com', avatarUrl: 'https://picsum.photos/seed/4/100/100', joinDate: '2023-05-20', totalBalance: 25000.00, status: 'Suspended' },
  { id: 'user5', name: 'Emily Davis', username: '@emily.d', email: 'emily.d@example.com', avatarUrl: 'https://picsum.photos/seed/5/100/100', joinDate: '2023-10-10', totalBalance: 76543.21, status: 'Active' },
];

export const totalUsers = users.length;
export const newlyRegisteredUsers = users.filter(u => new Date(u.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;

