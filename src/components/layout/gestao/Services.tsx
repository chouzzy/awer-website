'use client';

import { GestaoPageData } from "@/types";
import { Flex, VStack, Heading, Button, SimpleGrid, Icon, Text, Image } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import { Cases } from "../Cases/Cases";


const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};


export function Services({ pageData }: { pageData: GestaoPageData }) {


    const MotionFlex = motion(Flex);
    const MotionVStack = motion(VStack);

    return (
        <Flex w='100%' flexDir={'column'} gap={{ base: 16, lg:40 }} p={{base: 4, md: 16}}>
            {pageData.services.map((c, index) => {
                return (<Cases key={c.product + index} c={c} />)
            })}
        </Flex>
    )
}