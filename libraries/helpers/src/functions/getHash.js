export const getSimpleHash = (string_, seed = 0) => {
	let h1 = 0xde_ad_be_ef ^ seed
	let h2 = 0x41_c6_ce_57 ^ seed
	for (let ch, index = 0; index < string_.length; index++) {
		ch = string_.codePointAt(index)
		h1 = Math.imul(h1 ^ ch, 2_654_435_761)
		h2 = Math.imul(h2 ^ ch, 1_597_334_677)
		h1 = Math.imul(h1 ^ (h1 >>> 16), 2_246_822_507) ^ Math.imul(h2 ^ (h2 >>> 13), 3_266_489_909)
		h2 = Math.imul(h2 ^ (h2 >>> 16), 2_246_822_507) ^ Math.imul(h1 ^ (h1 >>> 13), 3_266_489_909)
	}
	h1 >>>= 0
	h2 >>>= 0
	return 4_294_967_296 * (2_097_151 & h2) + h1
}
