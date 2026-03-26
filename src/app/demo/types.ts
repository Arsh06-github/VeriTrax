export interface DemoState {
  step: number;
  campaign: {
    goal: number;
    raised: number;
    categories: string[];
  };
  wallet: string;
  amount: number;
  proofs: string[];
  hash: string;
  txId: string;
  donorAddress: string;
  needyAddress: string;
}

export const initialState: DemoState = {
  step: 1,
  campaign: {
    goal: 1000,
    raised: 0,
    categories: ['Food', 'Shelter'],
  },
  wallet: '',
  amount: 0.1,
  proofs: [],
  hash: '',
  txId: '',
  donorAddress: '',
  needyAddress: '0x789...def',
};
