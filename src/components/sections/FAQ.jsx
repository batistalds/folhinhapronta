import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { faqItems } from '@/data/faq'

export function FAQ() {
  return (
    <section id="faq" className="bg-petrol-50/40 py-16 sm:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="outline" className="mb-3">
            <HelpCircle className="mr-1 h-3.5 w-3.5" />
            Perguntas frequentes
          </Badge>
          <h2 className="text-3xl font-extrabold text-petrol sm:text-4xl">Ainda tem dúvidas?</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
