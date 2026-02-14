import { z } from 'zod';
import { ZakatMethodologySchema, MetaSchema, AssetsSchema, LiabilitiesSchema, ThresholdsSchema } from './schema';

export type ZakatMethodologyConfig = z.infer<typeof ZakatMethodologySchema>;
export type MethodologyMeta = z.infer<typeof MetaSchema>;
export type MethodologyAssets = z.infer<typeof AssetsSchema>;
export type MethodologyLiabilities = z.infer<typeof LiabilitiesSchema>;
export type MethodologyThresholds = z.infer<typeof ThresholdsSchema>;
