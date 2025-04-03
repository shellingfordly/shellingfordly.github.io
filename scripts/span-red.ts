import MarkdownIt from 'markdown-it';

export function SpanRed(markdownIt: MarkdownIt) {
	// 添加新的 inline 规则
	markdownIt.inline.ruler.before('emphasis', 'span_red', (state, silent) => {
		const start = state.pos;
		const max = state.posMax;

		// 检查是否以 [[ 开头
		if (state.src.charAt(start) !== '[' || state.src.charAt(start + 1) !== '[') {
			return false;
		}

		// 寻找 ]] 结束
		let end = start + 2;
		while (end < max && (state.src.charAt(end) !== ']' || state.src.charAt(end + 1) !== ']')) {
			end++;
		}
		if (end >= max || state.src.charAt(end) !== ']') {
			return false; // 未找到结束标记
		}

		if (!silent) {
			// 创建 token
			const token = state.push('span_red', '', 0);
			token.content = state.src.slice(start + 2, end); // 提取 [[ 和 ]] 之间的内容
			token.markup = '[[ ]]';
		}

		state.pos = end + 2; // 移动解析位置
		return true;
	});

	// 定义渲染规则
	markdownIt.renderer.rules.span_red = (tokens, idx) => {
		const content = tokens[idx].content;
		return `<span c-red>${content}</span>`; // 自定义渲染
	};
}