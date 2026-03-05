'use client';

import { Flex } from "@chakra-ui/react";
import { Cases } from "./Cases";
import { cases } from "@/data/cases";


export function CasesContainer() {

    return (
        <Flex w='100%' flexDir={'column'} gap={{ base: 16, lg:40 }}>
            {cases.map((c, index) => {
                return (<Cases key={c.product + index} c={c} />)
            })}
        </Flex>
    )
}