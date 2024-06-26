import { flattenedVerify } from '../flattened/verify.ts'
import { JWSInvalid } from '../../util/errors.ts'
import { decoder } from '../../lib/buffer_utils.ts'
import type {
  CompactVerifyResult,
  FlattenedJWSInput,
  GetKeyFunction,
  CompactJWSHeaderParameters,
  KeyLike,
  VerifyOptions,
  ResolvedKey,
} from '../../types.d.ts'

/**
 * Interface for Compact JWS Verification dynamic key resolution. No token components have been
 * verified at the time of this function call.
 *
 * @see [createRemoteJWKSet](../functions/jwks_remote.createRemoteJWKSet.md#function-createremotejwkset) to verify using a remote JSON Web Key Set.
 */
export interface CompactVerifyGetKey
  extends GetKeyFunction<CompactJWSHeaderParameters, FlattenedJWSInput> {}

/**
 * Verifies the signature and format of and afterwards decodes the Compact JWS.
 *
 * @param jws Compact JWS.
 * @param key Key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function compactVerify(
  jws: string | Uint8Array,
  key: KeyLike | Uint8Array,
  options?: VerifyOptions,
): Promise<CompactVerifyResult>
/**
 * @param jws Compact JWS.
 * @param getKey Function resolving a key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function compactVerify<T extends KeyLike = KeyLike>(
  jws: string | Uint8Array,
  getKey: CompactVerifyGetKey,
  options?: VerifyOptions,
): Promise<CompactVerifyResult & ResolvedKey<T>>
export async function compactVerify(
  jws: string | Uint8Array,
  key: KeyLike | Uint8Array | CompactVerifyGetKey,
  options?: VerifyOptions,
) {
  if (jws instanceof Uint8Array) {
    jws = decoder.decode(jws)
  }

  if (typeof jws !== 'string') {
    throw new JWSInvalid('Compact JWS must be a string or Uint8Array')
  }
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split('.')

  if (length !== 3) {
    throw new JWSInvalid('Invalid Compact JWS')
  }

  const verified = await flattenedVerify(
    { payload, protected: protectedHeader, signature },
    <Parameters<typeof flattenedVerify>[1]>key,
    options,
  )

  const result = { payload: verified.payload, protectedHeader: verified.protectedHeader! }

  if (typeof key === 'function') {
    return { ...result, key: verified.key }
  }

  return result
}
