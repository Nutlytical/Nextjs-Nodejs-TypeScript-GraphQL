import React from 'react';

import Layout from '../src/components/layout/Layout';
import PricingContent from '../src/components/PricingContentComponent';

function Home() {
	return (
		<>
			<PricingContent />
		</>
	);
}

Home.getLayout = function getLayout(page: React.ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Home;
