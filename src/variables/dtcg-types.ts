export interface TypographyTokenValue {
	fontFamily: string;
	fontSize: number;
	fontWeight: number;
	letterSpacing: number;
	lineHeight: number;
}

export interface GradientStop {
	color: string;
	position: number;
}

export type ColorTokenValue = `#${string}`;

export interface ShadowStop {
	color: string;
	offsetX: number;
	offsetY: number;
	blur: number;
	spread: number;
}

export type ShadowTokenValue = ShadowStop[];

export type GradientTokenValue = GradientStop[];

export type DesignTokenType = DesignToken['$type'];

export interface DesignTokenBase {
	$type: string;
	$description?: string;
	// biome-ignore lint: value is overwritten in specific token types.
	$value: any;
}

export interface ColorToken extends DesignTokenBase {
	$type: 'color';
	$value: ColorTokenValue;
}

export interface TypographyToken extends DesignTokenBase {
	$type: 'typography';
	$value: TypographyTokenValue;
}

export interface ShadowToken extends DesignTokenBase {
	$type: 'shadow';
	$value: ShadowTokenValue;
}

export interface GradientToken extends DesignTokenBase {
	$type: 'gradient';
	$value: GradientTokenValue;
}

export interface NumberToken extends DesignTokenBase {
	$type: 'number';
	$value: number;
}

export interface DimensionToken extends DesignTokenBase {
	$type: 'dimension';
	$value: string;
}

export type DesignToken =
	| ColorToken
	| TypographyToken
	| ShadowToken
	| GradientToken
	| NumberToken
	| DimensionToken
	| DesignTokenBase;

export interface DesignTokensFormatFlat {
	[k: string]: DesignToken;
}

export interface DesignTokensFormatDeep {
	[k: string]: DesignTokensFormatDeep;
}

export type DesignTokensFormat =
	| DesignTokensFormatDeep
	| DesignTokensFormatFlat;
