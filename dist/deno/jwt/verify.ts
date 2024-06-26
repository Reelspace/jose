import { compactVerify } from '../jws/compact/verify.ts'
import type {
  KeyLike,
  VerifyOptions,
  JWTClaimVerificationOptions,
  JWTHeaderParameters,
  GetKeyFunction,
  FlattenedJWSInput,
  JWTVerifyResult,
  ResolvedKey,
} from '../types.d.ts'
import jwtPayload from '../lib/jwt_claims_set.ts'
import { JWTInvalid } from '../util/errors.ts'

/** Combination of JWS Verification options and JWT Claims Set verification options. */
export interface JWTVerifyOptions extends VerifyOptions, JWTClaimVerificationOptions {}

/**
 * Interface for JWT Verification dynamic key resolution. No token components have been verified at
 * the time of this function call.
 *
 * @see [createRemoteJWKSet](../functions/jwks_remote.createRemoteJWKSet.md#function-createremotejwkset) to verify using a remote JSON Web Key Set.
 */
export interface JWTVerifyGetKey extends GetKeyFunction<JWTHeaderParameters, FlattenedJWSInput> {}

/**
 * Verifies the JWT format (to be a JWS Compact format), verifies the JWS signature, validates the
 * JWT Claims Set.
 *
 * @param jwt JSON Web Token value (encoded as JWS).
 * @param key Key to verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export async function jwtVerify(
  jwt: string | Uint8Array,
  key: KeyLike | Uint8Array,
  options?: JWTVerifyOptions,
): Promise<JWTVerifyResult>

/**
 * @param jwt JSON Web Token value (encoded as JWS).
 * @param getKey Function resolving a key to verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export async function jwtVerify<T extends KeyLike = KeyLike>(
  jwt: string | Uint8Array,
  getKey: JWTVerifyGetKey,
  options?: JWTVerifyOptions,
): Promise<JWTVerifyResult & ResolvedKey<T>>

export async function jwtVerify(
  jwt: string | Uint8Array,
  key: KeyLike | Uint8Array | JWTVerifyGetKey,
  options?: JWTVerifyOptions,
) {
  const verified = await compactVerify(jwt, <Parameters<typeof compactVerify>[1]>key, options)
  if (verified.protectedHeader.crit?.includes('b64') && verified.protectedHeader.b64 === false) {
    throw new JWTInvalid('JWTs MUST NOT use unencoded payload')
  }
  const payload = jwtPayload(verified.protectedHeader, verified.payload, options)
  const result = { payload, protectedHeader: verified.protectedHeader }
  if (typeof key === 'function') {
    return { ...result, key: verified.key }
  }
  return result
}
