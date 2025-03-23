import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import * as databaseSchema from '@wsh-2025/schema/src/database/schema';
import * as schema from '@wsh-2025/schema/src/openapi/schema';

function assertSchema<T>(_actual: z.ZodType<NoInfer<T>>, _expected: z.ZodType<T>): void {}

// Schema verifications
assertSchema(schema.channel, createSelectSchema(databaseSchema.channel));
assertSchema(schema.episode, createSelectSchema(databaseSchema.episode));
assertSchema(schema.series, createSelectSchema(databaseSchema.series));
assertSchema(schema.program, createSelectSchema(databaseSchema.program));
assertSchema(schema.recommendedItem, createSelectSchema(databaseSchema.recommendedItem));
assertSchema(schema.recommendedModule, createSelectSchema(databaseSchema.recommendedModule));
assertSchema(schema.user, createSelectSchema(databaseSchema.user));
