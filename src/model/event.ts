import { Prompt } from './prompt';
import { AutomatedAction } from './automated-action';
import { PlayerAction } from './player-action';

export type Event = PlayerAction | AutomatedAction | Prompt