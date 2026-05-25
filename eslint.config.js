// eslint.config.js
import js from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginUnusedImports from 'eslint-plugin-unused-imports'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
	{
		ignores: ['dist/**', 'node_modules/**', 'src/lib/**/*', 'src/components/ui/**/*'],
	},

	js.configs.recommended,
	...tseslint.configs.recommended,

	{
		files: ['src/**/*.{js,mjs,cjs,jsx,ts,tsx}'],
		languageOptions: {
			globals: globals.browser,
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		plugins: {
			react: pluginReact,
			'react-hooks': pluginReactHooks,
			'unused-imports': pluginUnusedImports,
		},
		rules: {
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'off',

			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],

			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-react': 'off',
			'react/jsx-uses-vars': 'error',

			'react/no-unknown-property': [
				'error',
				{ ignore: ['cmdk-input-wrapper', 'toast-close'] },
			],

			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
		},
	},
])