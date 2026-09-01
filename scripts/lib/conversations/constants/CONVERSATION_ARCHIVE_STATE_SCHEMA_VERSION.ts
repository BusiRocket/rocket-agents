/**
 * Bumped whenever a stored column stops meaning what it used to.
 *
 * The state database is disposable by design, so the cheap and correct
 * response to any mismatch is to delete it and replay the segments. That is
 * only safe while nothing canonical is kept here -- which is the reason this
 * number exists rather than a migration.
 */
export const CONVERSATION_ARCHIVE_STATE_SCHEMA_VERSION = 1
